variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnets" {
  type = list(string)
}

variable "ecs_security_group_id" {
  type = string
}

variable "container_definitions" {
  description = "List of containers for the ECS task definition"
  type = list(object({
    name  = string
    image = string
    port  = number
  }))
}


variable "cpu" {
  type        = string
  default     = "256"
  description = "The number of CPU units for the ECS task"
}

variable "memory" {
  type        = string
  default     = "512"
  description = "The amount of memory (MiB) for the ECS task"
}
