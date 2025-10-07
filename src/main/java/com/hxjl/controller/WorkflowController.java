package com.hxjl.controller;

import com.hxjl.entity.Approval;
import com.hxjl.entity.ProcessDefinition;
import com.hxjl.repository.ApprovalRepository;
import com.hxjl.repository.ProcessDefinitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/workflow")
public class WorkflowController {
    
    @Autowired
    private ApprovalRepository approvalRepository;
    
    @Autowired
    private ProcessDefinitionRepository processDefinitionRepository;
    
    // 审批中心接口
    @GetMapping("/approval")
    public ResponseEntity<Page<Approval>> getApprovals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(approvalRepository.findAll(pageable));
    }
    
    @PostMapping("/approval")
    public ResponseEntity<Approval> createApproval(@RequestBody Approval approval) {
        Approval savedApproval = approvalRepository.save(approval);
        return ResponseEntity.ok(savedApproval);
    }
    
    @PutMapping("/approval/{id}")
    public ResponseEntity<Approval> updateApproval(@PathVariable Long id, @RequestBody Approval approval) {
        if (!approvalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        approval.setId(id);
        Approval updatedApproval = approvalRepository.save(approval);
        return ResponseEntity.ok(updatedApproval);
    }
    
    // 流程设计接口
    @GetMapping("/design")
    public ResponseEntity<Page<ProcessDefinition>> getProcessDefinitions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(processDefinitionRepository.findAll(pageable));
    }
    
    @PostMapping("/design")
    public ResponseEntity<ProcessDefinition> createProcessDefinition(@RequestBody ProcessDefinition processDefinition) {
        ProcessDefinition saved = processDefinitionRepository.save(processDefinition);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/design/{id}")
    public ResponseEntity<ProcessDefinition> updateProcessDefinition(@PathVariable Long id, @RequestBody ProcessDefinition processDefinition) {
        if (!processDefinitionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        processDefinition.setId(id);
        ProcessDefinition updated = processDefinitionRepository.save(processDefinition);
        return ResponseEntity.ok(updated);
    }
}