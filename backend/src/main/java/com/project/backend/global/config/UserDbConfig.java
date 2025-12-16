package com.project.backend.global.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;   // ← 이게 정답
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = {
        "com.project.backend.domain.user.repository",
        "com.project.backend.domain.notice.repository",
        "com.project.backend.domain.history.repository",
        "com.project.backend.domain.customers",
        "com.project.backend.domain.performance"
    },
    entityManagerFactoryRef = "userEntityManager",
    transactionManagerRef = "userTransactionManager"
)
public class UserDbConfig {

    @Primary
    @Bean
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties userDataSourceProperties() {  // 반환 타입도 자동으로 맞춰짐
        return new DataSourceProperties();
    }

    @Primary
    @Bean(name = "userDataSource")
    public DataSource userDataSource() {
        return userDataSourceProperties()
                .initializeDataSourceBuilder()
                .build();
    }

    @Primary
    @Bean(name = "userEntityManager")
    public LocalContainerEntityManagerFactoryBean userEntityManager(
            EntityManagerFactoryBuilder builder,
            @Qualifier("userDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages(
                    "com.project.backend.domain.user.entity",
                    "com.project.backend.domain.notice.entity",
                    "com.project.backend.domain.history.entity",
                    "com.project.backend.domain.customers",
                    "com.project.backend.domain.performance"
                )
                .persistenceUnit("user")
                .build();
    }

    @Primary
    @Bean(name = "userTransactionManager")
    public PlatformTransactionManager userTransactionManager(
            @Qualifier("userEntityManager") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}