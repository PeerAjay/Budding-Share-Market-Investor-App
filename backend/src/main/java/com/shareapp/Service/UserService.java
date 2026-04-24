package com.shareapp.Service;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import com.shareapp.Model.User;
import com.shareapp.Repository.UserRepository;
import com.shareapp.DataTransferObjects.UserRegistrationDTO;


@Service
public class UserService {

    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User registerUser(UserRegistrationDTO registrationDTO) {
        //TODO implement user registration logic, including validation and saving to the database

        return new User();
    }


}
