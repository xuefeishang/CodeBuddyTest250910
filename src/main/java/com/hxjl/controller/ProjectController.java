package com.hxjl.controller;

import com.hxjl.entity.Project;
import com.hxjl.entity.Task;
import com.hxjl.repository.ProjectRepository;
import com.hxjl.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/project")
public class ProjectController {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    // 项目管理接口
    @GetMapping("/list")
    public ResponseEntity<Page<Project>> getProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(projectRepository.findAll(pageable));
    }
    
    @PostMapping("/list")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }
    
    @PutMapping("/list/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        project.setId(id);
        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }
    
    @DeleteMapping("/list/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // 任务管理接口
    @GetMapping("/task")
    public ResponseEntity<Page<Task>> getTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(taskRepository.findAll(pageable));
    }
    
    @PostMapping("/task")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }
    
    @PutMapping("/task/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        task.setId(id);
        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }
    
    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}