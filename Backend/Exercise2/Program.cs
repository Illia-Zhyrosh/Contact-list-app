

using Exercise2.Data;
using Exercise2.Models;
using Microsoft.EntityFrameworkCore;

namespace Exercise2
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddDbContext<ContactsContext>(options =>
            options.UseSqlite(@"Data Source=users.db")

            );

            builder.Services.AddSwaggerGen();

            
            var app = builder.Build();
            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed((host) => true)
                .AllowCredentials());

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            
            // Configure the HTTP request pipeline.
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}