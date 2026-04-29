package com.shareapp.repository;
import com.shareapp.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Holding findByAccountId(Long accountId);

}
