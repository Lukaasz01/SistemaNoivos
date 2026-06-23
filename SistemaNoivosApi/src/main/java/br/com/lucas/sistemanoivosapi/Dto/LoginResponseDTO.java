package br.com.lucas.sistemanoivosapi.Dto;

public record LoginResponseDTO(String email, String role, Long weddingProfileId, String token) {}