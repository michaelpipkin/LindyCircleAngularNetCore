const PROXY_CONFIG = [
  {
    context: [
      "/",
    ],
    target: "https://localhost:7140",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
