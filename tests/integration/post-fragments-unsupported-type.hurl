# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Content-Type: img/png

[BasicAuth]
user1@email.com:password1


# Body of the request goes in ```...``` when it's a string
`https://i.imgur.com/1230912930`

HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" isString