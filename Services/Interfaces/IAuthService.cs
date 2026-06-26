using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(string name, string email, string? phone, string password, string role);
        Task<(User? User, string? Token)> LoginAsync(string email, string password);
        string GenerateJwtToken(User user);
    }
}
