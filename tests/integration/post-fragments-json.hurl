# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Content-Type: application/json

[BasicAuth]
user1@email.com:password1


# Body of the request goes in ```...``` when it's a string
{
"Nonthachai" :"Lab-8"
}

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragments.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "application/json"
jsonpath "$.fragments.size" == 25


[Captures]
url: header "Location"


GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Length: 25
[Asserts]
header "Content-Type" matches "^application/json;\\s*charset=utf-8$"
jsonpath "$.Nonthachai" == "Lab-8"

