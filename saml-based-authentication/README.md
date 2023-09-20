# SAML Integration with Media Shuttle SDK

This documentation specifies steps to integrate SAML with Media Shuttle SDK using [Okta Workforce Identity Cloud](https://www.okta.com) and [AWS Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html).

## Create a SAML app in Okta

- Create an [Okta Workforce Identity](https://www.okta.com/free-trial/workforce-identity/) account and sign in.
- Create [SAML app integration](https://help.okta.com/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm).
- Under `GENERAL`, for Single sign on URL, enter `https://yourDomainPrefix.auth.region.amazoncognito.com/saml2/idpresponse`. Replace `yourDomainPrefix` and `region` with the values for your `user pool`.
- For `Audience URI (SP Entity ID)`, enter `urn:amazon:cognito:sp:yourUserPoolId`. Replace `yourUserPoolId` with your Amazon Cognito user pool ID. Find this value in the Amazon Cognito console on the `General settings` page for your user pool.
- Under `ATTRIBUTE STATEMENTS (OPTIONAL)`, add a statement with the following information:
  - For Name, enter the SAML attribute name `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`. 
  - For Value, enter `user.email`.
- [Assign a user](https://help.okta.com/en-us/content/topics/provisioning/lcm/lcm-assign-app-user.htm) to your Okta application.

## AWS Cognito Configuration

- Get the IdP metadata for your Okta application - On the Sign On tab for your Okta app, find the Identity Provider metadata hyperlink. Right-click the hyperlink, and then copy the URL.
- Configuration to be done by Signiant SRE in AWS Console.
  - Provide the `Login Identifier`(desired name) and `Metadata URL of the Okta App` to SRE for configuring your Okta app as identity provider in AWS Console.
  - Get `Console SSO` enabled for IdP login via Okta. This will create a user pool in the AWS Console and configure the `App Client Integration`.
  - Add callback URL (for example `http://sample-page.com/authCallback`) of the sample web page as allowed callback URL in Cognito User Pool App Client. For `Callback URL(s)`, enter a URL where you want your users to be redirected after they log in.

## SAML Flow

The following steps demonstrate on how to initiate the cognito login flow:

- Determine code verifier and code challenge required for authorization. You can use any online PKCE Generator Tool.
- Provide the code verifier and generate the code challenge
- Get the login redirect information via the `Signiant Platform API` - `/v1/authentication/loginRedirects`. 
  - Required parameters: loginIdentifier, redirect_uri (callback URL), code challenge (from above step).
- Redirect your web page to the redirectURL received from the response of `loginRedirects` api.
- The redirect_uri (callback URL) is invoked by Cognito with code request parameter, for example, `http://sample-page.com/authCallback?code=testCode`.
  - Exchange an authorization code grant with PKCE for refresh_token by making a [REST call](https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html) to the Cognito domain.
  - Use the refresh_token received in the response to initialize MS SDK library.