terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

backend "s3" {
    # Replace with values from terraform-bootstrap outputs
    bucket         = "microservices-demo-tfstate-e077bc4c"
    key            = "terraform/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "microservices-demo-tf-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}