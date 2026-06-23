package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Model.Vendor;
import br.com.lucas.sistemanoivosapi.Service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @GetMapping
    public List<Vendor> getAllVendors() {
        return vendorService.getAllVendors();
    }

    @PostMapping
    public Vendor createVendor(@RequestBody Vendor vendor) {
        return vendorService.saveVendor(vendor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @RequestBody Vendor vendorDetails) {
        return vendorService.getVendorById(id).map(vendor -> {
            vendor.setName(vendorDetails.getName());
            vendor.setCategory(vendorDetails.getCategory());
            vendor.setContactName(vendorDetails.getContactName());
            vendor.setPhone(vendorDetails.getPhone());
            vendor.setStatus(vendorDetails.getStatus());
            vendor.setCost(vendorDetails.getCost());
            vendor.setRating(vendorDetails.getRating());
            vendor.setFavorite(vendorDetails.isFavorite());
            vendor.setIcon(vendorDetails.getIcon());

            Vendor updatedVendor = vendorService.saveVendor(vendor);
            return ResponseEntity.ok(updatedVendor);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        return vendorService.getVendorById(id).map(vendor -> {
            vendorService.deleteVendor(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}