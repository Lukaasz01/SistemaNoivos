package br.com.lucas.sistemanoivosapi.Repository;

import br.com.lucas.sistemanoivosapi.Model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // 👈 Não esqueça do import

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // 👇 Novo método para encontrar a despesa pelo ID do fornecedor 👇
    Optional<Expense> findByVendorId(Long vendorId);
}