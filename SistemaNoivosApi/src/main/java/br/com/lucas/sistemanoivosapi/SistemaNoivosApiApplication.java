package br.com.lucas.sistemanoivosapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // 👈 Adicione este import

@SpringBootApplication
@EnableScheduling // 👈 Ativa o agendador automatico de tarefas
public class SistemaNoivosApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(SistemaNoivosApiApplication.class, args);
	}
}