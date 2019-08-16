package org.gome.search;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter  {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.headers().frameOptions().sameOrigin();
        http.authorizeRequests()
         .antMatchers("/cloud/test**","/p/s/**","/cloud/config**")
                .hasRole("test")
                .anyRequest().permitAll()
                .and().httpBasic();
    }

	@Override
	protected void configure(AuthenticationManagerBuilder  auth) throws Exception {
		auth
		.inMemoryAuthentication()
		.withUser("gome")
		.password("totem123")
		.roles("test");
	}
    
 
}