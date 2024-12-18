package com.example.ProjViewAPI.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.example.ProjViewAPI.repository.nxt",
        entityManagerFactoryRef = "nxtEntityManagerFactory",
        transactionManagerRef = "nxtTransactionManager"
)
public class NXTDataSourceConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean(name = "nxtDataSource")
    public DataSource nxtDataSource() {
        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }

    @Bean(name = "nxtEntityManagerFactoryBuilder")
    public EntityManagerFactoryBuilder nxtEntityManagerFactoryBuilder() {
        return new EntityManagerFactoryBuilder(new HibernateJpaVendorAdapter(), new HashMap<>(), null);
    }

    @Bean(name = "nxtEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean nxtEntityManagerFactory(
            @Qualifier("nxtEntityManagerFactoryBuilder") EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(nxtDataSource())
                .packages("com.example.ProjViewAPI.model")
                .persistenceUnit("nxt")
                .build();
    }

    @Bean(name = "nxtTransactionManager")
    public PlatformTransactionManager nxtTransactionManager(
            @Qualifier("nxtEntityManagerFactory") EntityManagerFactory nxtEntityManagerFactory) {
        return new JpaTransactionManager(nxtEntityManagerFactory);
    }
}
