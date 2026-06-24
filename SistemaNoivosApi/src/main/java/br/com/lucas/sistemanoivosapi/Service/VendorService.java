package br.com.lucas.sistemanoivosapi.Service;

import br.com.lucas.sistemanoivosapi.Model.Expense;
import br.com.lucas.sistemanoivosapi.Model.Vendor;
import br.com.lucas.sistemanoivosapi.Repository.ExpenseRepository;
import br.com.lucas.sistemanoivosapi.Repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ExpenseRepository expenseRepository; // 👈 Injetado para sincronizar o orçamento

    @Autowired
    private NotificationService notificationService;

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Optional<Vendor> getVendorById(Long id) {
        return vendorRepository.findById(id);
    }

    @Transactional
    public Vendor saveVendor(Vendor vendor) {
        // 1. Salva o fornecedor primeiro (para gerar o ID caso seja novo)
        Vendor savedVendor = vendorRepository.save(vendor);

        // 2. Dispara a sincronização automática com a tabela de orçamento
        syncWithBudget(savedVendor);

        return savedVendor;
    }

    @Transactional
    public void deleteVendor(Long id) {
        // 1. Remove o fornecedor
        vendorRepository.deleteById(id);

        // 2. Remove automaticamente a despesa atrelada a ele no orçamento
        expenseRepository.findByVendorId(id).ifPresent(expense -> {
            expenseRepository.delete(expense);
        });
    }

    private void syncWithBudget(Vendor vendor) {
        Expense expense = expenseRepository.findByVendorId(vendor.getId())
                .orElse(new Expense());

        expense.setVendorId(vendor.getId());
        expense.setDescription("Fornecedor: " + vendor.getName());
        expense.setCategory(mapCategory(vendor.getCategory()));
        expense.setEstimatedCost(vendor.getCost());

        if ("Contratado".equals(vendor.getStatus())) {
            expense.setActualCost(vendor.getCost());
            expense.setPaidAmount(vendor.getCost());
        } else {
            expense.setActualCost(0.0);
            expense.setPaidAmount(0.0);
        }

        Expense savedExpense = expenseRepository.save(expense);

        // 👇 2. LOGO APÓS SALVAR A DESPESA, CHAME O VERIFICADOR DE ORÇAMENTO 👇
        notificationService.checkBudgetThreshold(savedExpense);
    }

    private String mapCategory(String vendorCategory) {
        if (vendorCategory == null) return "Outros";

        switch (vendorCategory) {
            case "Espaço":
            case "Buffet":
                return "Espaço & Buffet";
            case "Fotografia":
                return "Foto & Vídeo";
            case "Música":
                return "Música";
            case "Decoração":
                return "Decoração";
            case "Trajes":
                return "Trajes";
            default:
                return "Outros";
        }
    }
}