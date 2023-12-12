POST http://localhost:8080/v1/fragments

Content-Type: image/gif

[BasicAuth]
user1@email.com:password1

file, lib/giphy.gif;


HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
header "Content-Type" == "image/gif; charset=utf-8"
jsonpath "$.status" == "ok"
jsonpath "$.fragments.type" == "image/gif"
# length of our fragments data
jsonpath "$.fragments.size" == 269876

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Length: 269876

[Asserts]
header "Content-Type" startsWith "image/gif"

PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1

`test`

HTTP/1.1 200


