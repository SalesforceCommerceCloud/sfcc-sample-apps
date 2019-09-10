
# Configure the Heroku provider
provider "heroku" {
  email   = "jalbert@salesforce.com"
}

# Create a new application
resource "heroku_app" "default" {
  name   = "${var.package_name}"
  region = "us"

  organization {
    name = "${var.team}"
  }
}

resource "heroku_addon" "redis" {
  app = "${heroku_app.default.id}"
  plan = "rediscloud:${var.redis_cache_size}"
}


resource "heroku_build" "application" {
  app = "${heroku_app.default.id}"

  source = {

    // NOTE: Seems as if having the node_modules directory already created will cause the deploy to fail.  So make sure you have it removed
    path = "${path.module}/../../${var.package_name}"
  }
}

output "app_url" {
  value = "https://${heroku_app.default.name}.herokuapp.com"
}

