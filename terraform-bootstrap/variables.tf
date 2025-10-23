variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region for Terraform backend resources"
}

variable "project_name" {
  type        = string
  default     = "microservices-demo"
  description = "Prefix for Terraform resources"
}