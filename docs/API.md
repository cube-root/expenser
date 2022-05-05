# API

## TO get the keys

```
 curl -X POST --header 'authorization: Bearer TokenFromTheDashboard' https://expenser-one.vercel.app/api/v1/integrations/keys
{"API_KEY":"sample_api_key","API_SECRET":"sample_secret_key"}
```