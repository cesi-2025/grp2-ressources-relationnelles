<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->text('name')->change();
            $table->text('email')->change();
            $table->string('email_hash', 64)->nullable()->unique();
        });

        DB::table('users')
            ->select(['id', 'name', 'email'])
            ->orderBy('id')
            ->get()
            ->each(function (object $user): void {
                $name = trim(strip_tags((string) $user->name));
                $email = strtolower(trim((string) $user->email));

                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'name' => Crypt::encryptString($name),
                        'email' => Crypt::encryptString($email),
                        'email_hash' => hash('sha256', $email),
                    ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')
            ->select(['id', 'name', 'email'])
            ->orderBy('id')
            ->get()
            ->each(function (object $user): void {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'name' => Crypt::decryptString((string) $user->name),
                        'email' => Crypt::decryptString((string) $user->email),
                    ]);
            });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email_hash']);
            $table->dropColumn('email_hash');
            $table->string('name')->change();
            $table->string('email')->change();
            $table->unique('email');
        });
    }
};
