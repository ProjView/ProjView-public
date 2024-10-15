package com.projview.projviewbe;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjViewBeApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv
                .configure()
                .filename(".env")
                .load();
        System.setProperty("POSTGRES_USER", dotenv.get("POSTGRES_USER"));
        System.setProperty("POSTGRES_PASSWORD", dotenv.get("POSTGRES_PASSWORD"));
        SpringApplication.run(ProjViewBeApplication.class, args);
    }

}
