---
layout: post
title: 'tweepy Quickstart: Basic App Creation, Configuration and Authentication'
tags: tweepy python
---


***INTRO NEEDS REWRITING---PUT HERE THE CAVEAT ABOUT THIS BEING ONLY FOR INTERACTING WITH
YOUR OWN TIMELINE; APPRECIABLE OTHER STEPS ARE REQUIRED FOR 3RD PARTY INTERACTIONS.*** 

***THIS APPEARS INCORRECT -- LOOKS LIKE YOU CAN AUTHENTICATE *ANY* TWITTER ACCOUNT
AT THE STEP OF .GET_AUTHORIZATION_URL() OR WHATEVER...THE MANUAL TOKEN GENERATION IS
JUST CLUNKY AND IMPRACTICAL FOR PRODUCTION USE FOR OTHERS TO USE AN APP.***

I recently wanted to set up `tweepy`, to drive a little content-feed [Twitter bot](https://twitter.com/Flake8Plugins) via [Github Action](https://github.com/bskinn/list-of-flake8-entrypoints). The `tweepy` docs have a pretty thorough [how-to for setting up authentication](http://docs.tweepy.org/en/v3.9.0/auth_tutorial.html), but it seemed pretty complicated and daunting, and seemed to be targeted at someone needing to authenticate for an arbitrary other Twitter account. Since all I needed was to authenticate for an account under my control, I went looking for a simpler way. Searching around, I came across a [Gist](https://gist.github.com/davej/113241) for deleting old tweets, and also there was this [Python Bytes](https://pythonbytes.fm/episodes/show/192/calculations-by-hand-but-in-the-compter-with-handcalcs) item on it. After a moderate bit of fiddling, I figured out what I think is a minimal set of steps to get `tweepy` set up for manual exploration, interacting with a Twitter account that you control.

High-level, you need to (1) authenticate an app within a developer account (gives link to the specific permissions and setup for the type of interactions permissible with the API), and (2) authenticate for interactions with a specific Twitter account. Even though for simple manual fiddling the developer account is going to be tied to the target Twitter account, you still have to authenticate both at the developer-app and main-twitter-account levels. *[more details on what an app is?]*

Finally, note that Twitter's Developer dashboard and v2 API are under active development, so some of the details here may diverge from the reality, over time.

----

### 1. Activate Developer Account

The first step is to create a Twitter developer account, if you don't have one already. I *think* developer accounts are always tied to a specific username on the main site...regardless, it's much simpler to work with a developer account tied to your Twitter account.

Log in to Twitter using the main account, and then navigate to developer.twitter.com and follow the Getting Started pathway. This process involves a bunch of questions, most of which I didn't really have detailed answers to. But, answering everything along the lines of  "I want to fiddle with the API" seemed to work fine.

Even though it said at the end that the developer account could take up to a day to activate, it gave me access pretty much immediately. YMMV, no guarantees.


### 2. Create App

As of Oct 2020, an app can live in one of two  contexts: standalone, or as part of a project. Both of these seemed to work fine with `tweepy`; for my exploration thus far, I've just used standalone apps.

1) Navigate to the Developer Portal from the landing page  
   &nbsp;  
   {% include img.html path="tweepy-quickstart/to-dev-portal.png" width="400px" %}

2) Navigate to the Projects & Apps > Overview dashboard page  
   &nbsp;  
   {% include img.html path="tweepy-quickstart/to-overview-page.png" width="250px" %}

3) Scroll to the bottom of the Overview page and click the "Create App" button  
   &nbsp;  
   {% include img.html path="tweepy-quickstart/create-app.png" width="400px" clicknote="1" %}

4) Choose an app name and click "Complete"

### 3. Store App Key Pair

The next page shows the API key, API secret key, and bearer token for the app you've just created. You'll want to store at least the API key and API secret key someplace permanent, such as local environment variables. While I'm sure the bearer token is important for some types of API interactions, I've never needed to use it for posting and deleting tweets on my own Twitter account.

I try to name my environment variables something memorable and unique, to make it obvious what they are and to avoid later collisions. In particular, I used `TWITTER_KEY` and `TWITTER_SECRET_KEY`---if I'd been working on a specific project, I would have added something related to that project to the names.

This should go without saying, but: as with all secrets *do not* commit them into any repo! If you end up wanting to use them in CI or some sort of automated process, use whatever secrets machinery is exposed by the provider.

### 4. Configure App

If all you want to do is retrieve tweets, then no specific configuration of the app is required---the default "Read" permissions enable access to all tweets visible to your Twitter account.

If you *do* want to post and delete tweets, you have to go into the app settings and upgrade the app permissions from "Read" to "Read and Write." If you want the app to have access to your DMs, then you have to bump the permissions all the way to "Read + Write + Direct Messages."

{% include img.html path="tweepy-quickstart/set-rw-perms.png" width="400px" %}

You can also customize the text description of the app, if you want. I typically haven't bothered.

I've never needed 3-legged OAuth for reading/writing my own tweets.

### 5. Generate and Store Access Token Pair

The app key pair from step 3 just authenticates permissions to use the Twitter developer app that you created in step 2; it doesn't actually give permissions to interact with your Twitter timeline, read or write. I used [this Gist](https://gist.github.com/davej/113241) as the basis for the following instructions for getting the necessary authentication tokens.

Start by firing up a Python interpreter and creating an authenticated `tweepy.OAuthHandler`:

```

>>> import os
>>> import tweepy
>>> auth = tweepy.OAuthHandler(os.environ["TWITTER_KEY"], os.environ["TWITTER_SECRET_KEY"])

```

Then, you have to use `auth` to request an authentication URL:

```

>>> auth.get_authorization_url()
'https://api.twitter.com/oauth/authorize?oauth_token={OAUTH_TOKEN}'

```

`{OATH_TOKEN}` will actually be a token hash; I've redacted it here.

Using a browser logged in to the Twitter account you
want to use with `tweepy`, navigate to this authorization URL.
You should see an authorization confirmation page like the following:

{% include img.html path="tweepy-quickstart/authorize-url.png" width="400px" clicknote="1" %}

Click to authorize, and Twitter will supply a numerical PIN (redacted here):

**IMAGE**

Return to Python and use that numeric PIN (passed as a **string**) to request the access tokens:

```

>>> auth.get_access_token("{PIN}")
('{USER_TOKEN}', '{USER_SECRET_TOKEN}')

```

`{USER_TOKEN}` and `{USER_SECRET_TOKEN}` will both be hashes. Save them!
I used the `TWITTER_TOKEN` and `TWITTER_SECRET_TOKEN` environment variables.


### 6. Using the Stored Secrets to Bootstrap tweepy

Once you have the secrets from steps 3 and 4 stored in environment variables, bootstrapping tweepy in subsequent somethings is just

{Python code}

This will give you a fully authenticated `api` instance, from which you can do API stuff (link to [tweepy docs](http://docs.tweepy.org/en/latest/getting_started.html)). {Main actions are getting, creating, deleting tweets, which go through api.get_status, api.update_status, api.destroy_status}

...
- [Gist that provided the background to get authenticated](https://gist.github.com/davej/113241)
- [~Landing spot for tweepy docs](http://docs.tweepy.org/en/latest/getting_started.html)
- [Search for deleting tweets from specific account across given date range](https://twitter.com/search?q=(from%3Abtskinn)%20until%3A2011-01-01%20since%3A2010-01-01&src=typed_query&f=live)


{% include stackedit.html %}

