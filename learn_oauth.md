# Learning OAuth 2.0

## Intro

OAuth 2 is an authorization framework that enables applications to obtain limited \
access to user accounts on an HTTP service, such as Facebook, GitHub, and DigitalOcean. \
It works by delegating user authentication to the service that hosts the user \
account, and authorizing third-party applications to access the user account.\

## OAuth roles

1. Resource Owner
2. Client
3. Resource Server
4. Authorization Server

### Resource Owner: User

The resource owner is the user who authorizes an application to access their account. 
The application's access to the user's account is limited to the 'scope' of the 
authorization granted.

### Resource / Authorization Server: API

The resource server hosts the protected user accounts, and the authorization server 
verifies the identity of the user then issues access tokens to the application.

### Client: Application

The client is the application that wants to access the user’s account. Before it 
may do so, it must be authorized by the user, and the authorization must be validated by the API.

## Abstract Protocol Flow

https://assets.digitalocean.com/articles/oauth/abstract_flow.png

##### todo

learn OAuth 2.0 .
implement API .
add data persistence .




# [REDDIT WORKFLOW](https://github.com/reddit-archive/reddit/wiki/OAuth2)


1. register app
2. get authorization token. (FOR THE APP | user will be sent to the authorise page.)
	send user to ->	https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&
    state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING

	params ->
	
	1. `client_id` -> The Client ID generated during app [registration](https://www.reddit.com/prefs/apps)
					  desc -> Tells reddit.com which app is making the request
	2. `response_type` -> code | desc -> 	Must be the string "code". For implicit grants, see below.
	3. state -> A string of your choosing
				desc: You should generate a unique, possibly random, string for each authorization request. This value will be returned to you when the user visits your REDIRECT_URI after allowing your app access - you should verify that it matches the one you sent. This ensures that only authorization requests you've started are ones you finish. (You may also use this value to, for example, tell your webserver what action to take after receiving the OAuth2 bearer token)

3.Token Retrieval (code flow)

If the user chooses to allow your application, their browser will be instructed
to redirect to your app's registered redirect_uri. The redirect URI will have 
the information below attached as query parameters. You should parse the query parameters 
for the URI for use in the next step.

Parameter	Values	Description

error	`access_denied`, See error table below for list of causes.
		others
code	A string	A one-time use code that may be exchanged for a bearer token. See the next step
state	A string	This value should be the same as the one sent in the initial authorization request, and your app should verify that it is, in fact, the same. Your app may also do anything else it wishes with the state info, such as parse a portion of it to determine what action to perform on behalf of the user.

### Retrieving the Access Token

If you didn't get an error and the state value checks out, you may then make a POST request with code to the following URL to retrieve your access token:

`https://www.reddit.com/api/v1/access_token`

Include the following information in your POST data (NOT as part of the URL)

`grant_type=authorization_code&code=CODE&redirect_uri=URI`

Header -> authorisation: The "user" is the `client_id`. The "password" for
		  confidential clients is the `client_secret`.

RES:
The response from this request, if successful, will be JSON of the following format:

{
    "access_token": Your access token,
    "token_type": "bearer",
    "expires_in": Unix Epoch Seconds,
    "scope": A scope string,
    "refresh_token": Your refresh token
}


