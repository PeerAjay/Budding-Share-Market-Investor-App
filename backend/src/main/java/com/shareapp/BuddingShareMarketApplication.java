package com.shareapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BuddingShareMarketApplication {
    public static void main(String[] args) {
        SpringApplication.run(BuddingShareMarketApplication.class, args);
    }

}
