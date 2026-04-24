output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.k8s_node.public_ip
}

output "private_key" {
  description = "Private key for SSH access"
  value       = tls_private_key.k8s_key.private_key_pem
  sensitive   = true
}