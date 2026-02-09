package com.library.config;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

import lombok.extern.slf4j.Slf4j;

/**
 * Configuration for asynchronous event processing.
 * Configures thread pool for @Async annotated methods.
 */
@Configuration
@Slf4j
public class AsyncConfiguration implements AsyncConfigurer {

    /**
     * Configure the executor for async event processing.
     *
     * @return Configured thread pool executor
     */
    @Bean(name = "eventExecutor")
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // Core pool size - number of threads to keep alive
        executor.setCorePoolSize(5);

        // Max pool size - maximum number of threads
        executor.setMaxPoolSize(10);

        // Queue capacity - number of tasks to queue before creating new threads
        executor.setQueueCapacity(100);

        // Thread name prefix for debugging
        executor.setThreadNamePrefix("event-handler-");

        // Wait for tasks to complete on shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);

        // Max time to wait for tasks to complete (30 seconds)
        executor.setAwaitTerminationSeconds(30);

        executor.initialize();
        return executor;
    }

    /**
     * Handle exceptions thrown by async methods.
     *
     * @return Exception handler
     */
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            log.error("Exception in async method: {} with params: {}",
                method.getName(), params, throwable);

            // In production, you might want to:
            // 1. Send alerts
            // 2. Trigger compensation logic
            // 3. Store failed events for retry
        };
    }
}
