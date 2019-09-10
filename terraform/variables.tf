
variable "redis_cache_size" {
  default = "30"
  description = "The cache size of the reids cloud service in your heroku env"
}

variable "package_name" {
  description = "Name of your project, should also match your "
}

variable "team" {
  default = "test-terraform"
  description = "Heroku team (or organization) you want to deploy the app within"
}
