# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Content-Type: text/plain

[BasicAuth]
noid@email.com:password1


# Body of the request goes in ```...``` when it's a string
`This is a fragment!`


HTTP/1.1 401
[Asserts]
header "Content-Type" == "application/json; charset=utf-8"
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" isString
