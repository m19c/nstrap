Welcome to the contribution Guideline of `nstrap`
=================================================
Welcome, we really appreciate your support. :+1: :+1:

Feel free to submit pull requests to this repository. But first of all just take a look at our guidline.

## Coding Standard
1. Use an intend of 2 spaces.
1. Do not use non-strict stuff like `==` or `!=`.
1. Just one var per function allowed. Note that this declaration must be on top!
1. Use single quotes and avoid escaping characters.
1. No trailing spaces allowed.
1. Multiple blank lines are forbidden.
1. Do not use `_` in variables or objects (or somewhere else).
1. Use yoda style e.g. `1 === myVar`.
1. Allowed globals:
  - `describe`
  - `it`
  - `before`
  - `after`
  - `expect`
  - `beforeEach`
  - `afterEach`

Put your eyes on our `.eslintrc` to get additional information about the Coding Standard of `nstrap`.

## Update the registry
On the root of this repository you will find a `registry.json`. Feel free to populate your `nstrap` module.

```json
{
  "registry": [
    {
      "name": "my-nstrap-module",
      "description": "...",
      "repository": "MrBoolean/my-nstrap-module"
    }
  ]
}
```

**Within a short time we will release a simple registry site. This site will use this `registry.json` to access the information about your packages.**

Once you are done, submit a pull request.