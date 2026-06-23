package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Model.Expense;
import br.com.lucas.sistemanoivosapi.Service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseService.saveExpense(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        return expenseService.getExpenseById(id).map(expense -> {
            expense.setDescription(expenseDetails.getDescription());
            expense.setCategory(expenseDetails.getCategory());
            expense.setEstimatedCost(expenseDetails.getEstimatedCost());
            expense.setActualCost(expenseDetails.getActualCost());
            expense.setPaidAmount(expenseDetails.getPaidAmount());

            Expense updatedExpense = expenseService.saveExpense(expense);
            return ResponseEntity.ok(updatedExpense);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        return expenseService.getExpenseById(id).map(expense -> {
            expenseService.deleteExpense(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}