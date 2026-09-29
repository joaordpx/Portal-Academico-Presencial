<?php

namespace App\Providers;

use App\Models\Course;
use App\Models\Center;
use App\Models\Department;
use App\Models\Subject;
use App\Policies\CenterPolicy;
use App\Policies\CoursePolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\SubjectPolicy;
use App\Services\CenterService;
use App\Services\AdminCourseService;
use App\Services\CourseService;
use App\Services\DepartmentService;
use App\Services\SubjectService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CourseService::class, function ($app) {
            return new CourseService();
        });

        $this->app->singleton(AdminCourseService::class, function ($app) {
            return new AdminCourseService();
        });

        $this->app->singleton(CenterService::class, function ($app) {
            return new CenterService();
        });

        $this->app->singleton(DepartmentService::class, function ($app) {
            return new DepartmentService();
        });

        $this->app->singleton(SubjectService::class, function ($app) {
            return new SubjectService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Course::class, CoursePolicy::class);
        Gate::policy(Subject::class, SubjectPolicy::class);
        Gate::policy(Center::class, CenterPolicy::class);
        Gate::policy(Department::class, DepartmentPolicy::class);
        Gate::policy(\App\Models\Document::class, \App\Policies\DocumentPolicy::class);
    }
}
