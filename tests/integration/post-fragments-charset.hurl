# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Content-Type: text/plain; charset=utf-8

[BasicAuth]
user1@email.com:password1

`Nonthachai Fragments`

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.fragments.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "text/plain; charset=utf-8"
[Captures] 
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 20
[Asserts]
body == "Nonthachai Fragments"

