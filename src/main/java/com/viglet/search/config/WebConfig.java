package com.viglet.search.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward React Router routes to index.html
        registry.addViewController("/content").setViewName("forward:/index.html");
        registry.addViewController("/content/**").setViewName("forward:/index.html");
        registry.addViewController("/search").setViewName("forward:/index.html");
        registry.addViewController("/search/**").setViewName("forward:/index.html");
    }
}