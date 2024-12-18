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
        basePackages = "com.example.ProjViewAPI.repository.tuke",
        entityManagerFactoryRef = "tukeEntityManagerFactory",
        transactionManagerRef = "tukeTransactionManager"
)
public class TukeDataSourceConfig {

    @Value("${spring.datasource.url.tuke}")
    private String url;

    @Value("${spring.datasource.username.tuke}")
    private String username;

    @Value("${spring.datasource.password.tuke}")
    private String password;

    @Bean(name = "tukeDataSource")
    public DataSource tukeDataSource() {
        return DataSourceBuilder.create()
                .url(url) // Use the injected URL
                .username(username) // Use the injected username
                .password(password) // Use the injected password
                .driverClassName("org.postgresql.Driver")
                .build();
    }

    @Bean(name = "tukeEntityManagerFactoryBuilder")
    public EntityManagerFactoryBuilder tukeEntityManagerFactoryBuilder() {
        return new EntityManagerFactoryBuilder(new HibernateJpaVendorAdapter(), new HashMap<>(), null);
    }

    @Bean(name = "tukeEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean tukeEntityManagerFactory(
            @Qualifier("tukeEntityManagerFactoryBuilder") EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(tukeDataSource())
                .packages("com.example.ProjViewAPI.model")
                .persistenceUnit("tuke")
                .build();
    }

    @Bean(name = "tukeTransactionManager")
    public PlatformTransactionManager tukeTransactionManager(
            @Qualifier("tukeEntityManagerFactory") EntityManagerFactory tukeEntityManagerFactory) {
        return new JpaTransactionManager(tukeEntityManagerFactory);
    }
}
