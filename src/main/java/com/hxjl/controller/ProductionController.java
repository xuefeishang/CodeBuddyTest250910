package com.hxjl.controller;

import com.hxjl.entity.MineralProcessing;
import com.hxjl.entity.Mining;
import com.hxjl.entity.Tailings;
import com.hxjl.entity.QualityControl;
import com.hxjl.repository.MineralProcessingRepository;
import com.hxjl.repository.MiningRepository;
import com.hxjl.repository.TailingsRepository;
import com.hxjl.repository.QualityControlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/production")
public class ProductionController {
    
    @Autowired
    private MineralProcessingRepository mineralProcessingRepository;
    
    @Autowired
    private MiningRepository miningRepository;
    
    @Autowired
    private TailingsRepository tailingsRepository;
    
    @Autowired
    private QualityControlRepository qualityControlRepository;
    
    // 选矿管理接口
    @GetMapping("/mineral-processing")
    public ResponseEntity<Page<MineralProcessing>> getMineralProcessing(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(mineralProcessingRepository.findAll(pageable));
    }
    
    @PostMapping("/mineral-processing")
    public ResponseEntity<MineralProcessing> createMineralProcessing(@RequestBody MineralProcessing mineralProcessing) {
        MineralProcessing saved = mineralProcessingRepository.save(mineralProcessing);
        return ResponseEntity.ok(saved);
    }
    
    // 采矿管理接口
    @GetMapping("/mining")
    public ResponseEntity<Page<Mining>> getMining(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(miningRepository.findAll(pageable));
    }
    
    @PostMapping("/mining")
    public ResponseEntity<Mining> createMining(@RequestBody Mining mining) {
        Mining saved = miningRepository.save(mining);
        return ResponseEntity.ok(saved);
    }
    
    // 尾矿管理接口
    @GetMapping("/tailings")
    public ResponseEntity<Page<Tailings>> getTailings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(tailingsRepository.findAll(pageable));
    }
    
    @PostMapping("/tailings")
    public ResponseEntity<Tailings> createTailings(@RequestBody Tailings tailings) {
        Tailings saved = tailingsRepository.save(tailings);
        return ResponseEntity.ok(saved);
    }
    
    // 质检管理接口
    @GetMapping("/quality-control")
    public ResponseEntity<Page<QualityControl>> getQualityControl(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(qualityControlRepository.findAll(pageable));
    }
    
    @PostMapping("/quality-control")
    public ResponseEntity<QualityControl> createQualityControl(@RequestBody QualityControl qualityControl) {
        QualityControl saved = qualityControlRepository.save(qualityControl);
        return ResponseEntity.ok(saved);
    }
}