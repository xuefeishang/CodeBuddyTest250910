package com.hxjl.repository;

import com.hxjl.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByParentIsNull();
    
    @Query("SELECT m FROM Menu m WHERE m.type = 'DIRECTORY' ORDER BY m.sort")
    List<Menu> findDirectories();
    
    List<Menu> findByParentId(Long parentId);
}