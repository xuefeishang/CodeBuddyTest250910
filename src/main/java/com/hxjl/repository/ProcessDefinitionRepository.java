package com.hxjl.repository;

import com.hxjl.entity.ProcessDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessDefinitionRepository extends JpaRepository<ProcessDefinition, Long> {
}