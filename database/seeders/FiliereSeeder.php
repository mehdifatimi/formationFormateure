<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;
use App\Models\Cdc;

class FiliereSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifier si la table des CDC est vide
        if (Cdc::count() === 0) {
            // Créer les CDC si elles n'existent pas
            $cdcs = [
                ['nom' => 'CDC Informatique'],
                ['nom' => 'CDC Commerce'],
                ['nom' => 'CDC Industrie'],
                ['nom' => 'CDC Services'],
                ['nom' => 'CDC Santé'],
                ['nom' => 'CDC Agriculture'],
            ];

            foreach ($cdcs as $cdc) {
                Cdc::create($cdc);
            }
        }

        // Vérifier si la table des filières est vide
        if (Filiere::count() === 0) {
            // Récupérer les CDC
            $cdcInformatique = Cdc::where('nom', 'CDC Informatique')->first();
            $cdcCommerce = Cdc::where('nom', 'CDC Commerce')->first();
            $cdcIndustrie = Cdc::where('nom', 'CDC Industrie')->first();
            $cdcServices = Cdc::where('nom', 'CDC Services')->first();
            $cdcSante = Cdc::where('nom', 'CDC Santé')->first();
            $cdcAgriculture = Cdc::where('nom', 'CDC Agriculture')->first();

            // Ajouter les filières pour chaque CDC
            $filieres = [
                // CDC Informatique
                ['cdc_id' => $cdcInformatique->id, 'nom' => 'Développement Web', 'description' => 'Formation en développement web full-stack avec les dernières technologies'],
                ['cdc_id' => $cdcInformatique->id, 'nom' => 'Réseaux et Systèmes', 'description' => 'Formation en administration réseau et systèmes informatiques'],
                ['cdc_id' => $cdcInformatique->id, 'nom' => 'Data Science', 'description' => 'Formation en analyse de données et intelligence artificielle'],
                ['cdc_id' => $cdcInformatique->id, 'nom' => 'Cybersécurité', 'description' => 'Formation en sécurité informatique et protection des données'],
                ['cdc_id' => $cdcInformatique->id, 'nom' => 'Mobile Development', 'description' => 'Formation en développement d\'applications mobiles'],

                // CDC Commerce
                ['cdc_id' => $cdcCommerce->id, 'nom' => 'Marketing Digital', 'description' => 'Formation en marketing digital et e-commerce'],
                ['cdc_id' => $cdcCommerce->id, 'nom' => 'Gestion Commerciale', 'description' => 'Formation en gestion commerciale et techniques de vente'],
                ['cdc_id' => $cdcCommerce->id, 'nom' => 'Logistique', 'description' => 'Formation en logistique et supply chain management'],
                ['cdc_id' => $cdcCommerce->id, 'nom' => 'Comptabilité', 'description' => 'Formation en comptabilité et gestion financière'],
                ['cdc_id' => $cdcCommerce->id, 'nom' => 'Management', 'description' => 'Formation en management et leadership'],

                // CDC Industrie
                ['cdc_id' => $cdcIndustrie->id, 'nom' => 'Maintenance Industrielle', 'description' => 'Formation en maintenance des équipements industriels'],
                ['cdc_id' => $cdcIndustrie->id, 'nom' => 'Qualité et Sécurité', 'description' => 'Formation en qualité et sécurité industrielle'],
                ['cdc_id' => $cdcIndustrie->id, 'nom' => 'Production', 'description' => 'Formation en gestion de production industrielle'],
                ['cdc_id' => $cdcIndustrie->id, 'nom' => 'Énergie', 'description' => 'Formation en énergie et efficacité énergétique'],
                ['cdc_id' => $cdcIndustrie->id, 'nom' => 'Mécanique', 'description' => 'Formation en mécanique industrielle'],

                // CDC Services
                ['cdc_id' => $cdcServices->id, 'nom' => 'Tourisme', 'description' => 'Formation en gestion touristique et hôtelière'],
                ['cdc_id' => $cdcServices->id, 'nom' => 'Ressources Humaines', 'description' => 'Formation en gestion des ressources humaines'],
                ['cdc_id' => $cdcServices->id, 'nom' => 'Communication', 'description' => 'Formation en communication et relations publiques'],
                ['cdc_id' => $cdcServices->id, 'nom' => 'Éducation', 'description' => 'Formation en pédagogie et enseignement'],
                ['cdc_id' => $cdcServices->id, 'nom' => 'Social', 'description' => 'Formation en travail social et développement communautaire'],

                // CDC Santé
                ['cdc_id' => $cdcSante->id, 'nom' => 'Soins Infirmiers', 'description' => 'Formation en soins infirmiers et techniques médicales'],
                ['cdc_id' => $cdcSante->id, 'nom' => 'Pharmacie', 'description' => 'Formation en techniques pharmaceutiques'],
                ['cdc_id' => $cdcSante->id, 'nom' => 'Laboratoire', 'description' => 'Formation en techniques de laboratoire médical'],
                ['cdc_id' => $cdcSante->id, 'nom' => 'Radiologie', 'description' => 'Formation en techniques de radiologie médicale'],
                ['cdc_id' => $cdcSante->id, 'nom' => 'Rééducation', 'description' => 'Formation en kinésithérapie et rééducation'],

                // CDC Agriculture
                ['cdc_id' => $cdcAgriculture->id, 'nom' => 'Agronomie', 'description' => 'Formation en agronomie et techniques agricoles'],
                ['cdc_id' => $cdcAgriculture->id, 'nom' => 'Élevage', 'description' => 'Formation en élevage et production animale'],
                ['cdc_id' => $cdcAgriculture->id, 'nom' => 'Agroalimentaire', 'description' => 'Formation en transformation agroalimentaire'],
                ['cdc_id' => $cdcAgriculture->id, 'nom' => 'Pêche', 'description' => 'Formation en techniques de pêche et aquaculture'],
                ['cdc_id' => $cdcAgriculture->id, 'nom' => 'Environnement', 'description' => 'Formation en gestion environnementale et développement durable'],
            ];

            foreach ($filieres as $filiere) {
                Filiere::create($filiere);
            }
        }
    }
} 