using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using JobPrepPortal.DTOs;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;

namespace JobPrepPortal.Controllers.Api
{
    [ApiController]
    [Route("api/code")]
    [Authorize]
    public class CodeApiController : ControllerBase
    {
        private readonly ICodeRepository _codeRepository;
        private readonly ILogger<CodeApiController> _logger;

        public CodeApiController(ICodeRepository codeRepository, ILogger<CodeApiController> logger)
        {
            _codeRepository = codeRepository;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet("problems")]
        public async Task<IActionResult> GetProblems()
        {
            var problems = await _codeRepository.GetAllProblemsAsync();
            return Ok(problems);
        }

        [HttpGet("problems/{id}")]
        public async Task<IActionResult> GetProblemDetails(int id)
        {
            var problem = await _codeRepository.GetProblemByIdAsync(id);
            if (problem == null)
            {
                return NotFound(new { message = "Problem not found." });
            }
            return Ok(problem);
        }

        [HttpPost("run")]
        public IActionResult RunCode([FromBody] CodeRunDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Simulate compiling/running code
            bool compileSuccess = !dto.Code.Contains("syntax error") && !dto.Code.Contains("CompilationError");
            if (!compileSuccess)
            {
                return Ok(new
                {
                    success = false,
                    output = "Compilation Error: Line 3: Unexpected token ';' or undefined variable.",
                    status = "Compilation Error"
                });
            }

            // Simulate test cases output
            string mockOutput = "Test Case 1 passed.\nTest Case 2 passed.\nAll test runs complete.";
            return Ok(new
            {
                success = true,
                output = mockOutput,
                status = "Success"
            });
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitCode([FromBody] CodeRunDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();

                // Simple checker rule
                string result = "Accepted";
                if (dto.Code.Contains("error") || dto.Code.Contains("throw"))
                {
                    result = "Runtime Error";
                }
                else if (dto.Code.Length < 30)
                {
                    result = "Wrong Answer";
                }

                var submission = new CodeSubmission
                {
                    UserId = userId,
                    CodingProblemId = dto.ProblemId,
                    Language = dto.Language,
                    Code = dto.Code,
                    Result = result,
                    SubmittedDate = DateTime.UtcNow
                };

                var savedSubmission = await _codeRepository.CreateSubmissionAsync(submission);

                return Ok(new
                {
                    message = "Code submitted successfully.",
                    submission = new
                    {
                        savedSubmission.Id,
                        savedSubmission.CodingProblemId,
                        savedSubmission.Language,
                        savedSubmission.Result,
                        savedSubmission.SubmittedDate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting code for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("submissions")]
        public async Task<IActionResult> GetSubmissions()
        {
            var userId = GetCurrentUserId();
            var submissions = await _codeRepository.GetUserSubmissionsAsync(userId);
            return Ok(submissions);
        }
    }
}
