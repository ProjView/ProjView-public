package com.example.ProjViewAPI.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
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

    @Bean(name = "tukeDataSource")
    public DataSource tukeDataSource() {
        return DataSourceBuilder.create()
                .url("jdbc:postgresql://nxtsoft.sk:5432/b6bltl5e")
                .username("b6bltl5e")
                .password("Hd24^]+{Zy")
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
