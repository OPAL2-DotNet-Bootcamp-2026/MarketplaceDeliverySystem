using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class UserService
    {
        private readonly UserRepo _userRepository;
        //private readonly AuthService _authService;

        //public UserService(UserRepository userRepository,
        //           AuthService authService)
        //{
        //    _userRepository = userRepository;
        //    _authService = authService;
        //}
        public UserService(UserRepo userRepository)
        {
            _userRepository = userRepository;
        }
        public LoginResponseDTO Login(LoginDTO dto)
        {
            User user = _userRepository.GetByEmail(dto.Email);

            if (user == null)
                return null;

            bool valid =
                BCrypt.Net.BCrypt.Verify(dto.Password,
                                         user.PasswordHash);

            if (!valid)
                return null;

            //string token = GenerateJwtToken(user);

            return new LoginResponseDTO
            {
                //Token = token,
                Role = user.Role,
                FullName = user.FullName
            };
        }
    }
}
