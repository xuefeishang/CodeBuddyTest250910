package com.hxjl.controller;

import com.hxjl.entity.Customer;
import com.hxjl.entity.Supplier;
import com.hxjl.entity.Opportunity;
import com.hxjl.entity.Contract;
import com.hxjl.repository.CustomerRepository;
import com.hxjl.repository.SupplierRepository;
import com.hxjl.repository.OpportunityRepository;
import com.hxjl.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/crm")
public class CrmController {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private OpportunityRepository opportunityRepository;
    
    @Autowired
    private ContractRepository contractRepository;
    
    // 客户管理接口
    @GetMapping("/customers")
    public ResponseEntity<Page<Customer>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(customerRepository.findAll(pageable));
    }
    
    @PostMapping("/customers")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(savedCustomer);
    }
    
    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customer.setId(id);
        Customer updatedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(updatedCustomer);
    }
    
    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // 供应商管理接口
    @GetMapping("/suppliers")
    public ResponseEntity<Page<Supplier>> getSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(supplierRepository.findAll(pageable));
    }
    
    @PostMapping("/suppliers")
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        Supplier savedSupplier = supplierRepository.save(supplier);
        return ResponseEntity.ok(savedSupplier);
    }
    
    @PutMapping("/suppliers/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplier.setId(id);
        Supplier updatedSupplier = supplierRepository.save(supplier);
        return ResponseEntity.ok(updatedSupplier);
    }
    
    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // 商机管理接口
    @GetMapping("/opportunities")
    public ResponseEntity<Page<Opportunity>> getOpportunities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(opportunityRepository.findAll(pageable));
    }
    
    @PostMapping("/opportunities")
    public ResponseEntity<Opportunity> createOpportunity(@RequestBody Opportunity opportunity) {
        Opportunity savedOpportunity = opportunityRepository.save(opportunity);
        return ResponseEntity.ok(savedOpportunity);
    }
    
    @PutMapping("/opportunities/{id}")
    public ResponseEntity<Opportunity> updateOpportunity(@PathVariable Long id, @RequestBody Opportunity opportunity) {
        if (!opportunityRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        opportunity.setId(id);
        Opportunity updatedOpportunity = opportunityRepository.save(opportunity);
        return ResponseEntity.ok(updatedOpportunity);
    }
    
    @DeleteMapping("/opportunities/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable Long id) {
        if (!opportunityRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        opportunityRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // 合同管理接口
    @GetMapping("/contracts")
    public ResponseEntity<Page<Contract>> getContracts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(contractRepository.findAll(pageable));
    }
    
    @PostMapping("/contracts")
    public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
        Contract savedContract = contractRepository.save(contract);
        return ResponseEntity.ok(savedContract);
    }
    
    @PutMapping("/contracts/{id}")
    public ResponseEntity<Contract> updateContract(@PathVariable Long id, @RequestBody Contract contract) {
        if (!contractRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contract.setId(id);
        Contract updatedContract = contractRepository.save(contract);
        return ResponseEntity.ok(updatedContract);
    }
    
    @DeleteMapping("/contracts/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        if (!contractRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contractRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}