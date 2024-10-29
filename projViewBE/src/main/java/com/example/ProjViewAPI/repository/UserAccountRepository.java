package com.example.ProjViewAPI.repository;

import com.example.ProjViewAPI.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional
@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    /**
     * Returns UserAccount based on provided username in form of String
     *
     * @return user is returned in form of Optional, for case user isn't found
     */
    Optional<UserAccount> findUserByUsername(String username);
}
