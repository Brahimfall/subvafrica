<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pitch Deck - {{ $data['project_name'] }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background: #f8f9fa;
        }
        
        .slide {
            width: 210mm;
            height: 148mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            page-break-after: always;
            position: relative;
            overflow: hidden;
        }
        
        .slide:last-child {
            page-break-after: avoid;
        }
        
        .slide-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .slide-header h1 {
            margin: 0;
            font-size: 36px;
            font-weight: 300;
        }
        
        .slide-header h2 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        
        .slide-content {
            flex: 1;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .slide-title {
            background: #2c3e50;
            color: white;
            padding: 20px 40px;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        
        .slide-content h3 {
            color: #2c3e50;
            font-size: 20px;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        
        .slide-content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px;
            text-align: justify;
        }
        
        .slide-content ul {
            font-size: 16px;
            line-height: 1.8;
        }
        
        .slide-content li {
            margin-bottom: 10px;
        }
        
        .highlight-box {
            background: #ecf0f1;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 5px 5px 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .stat-item {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #3498db;
            display: block;
        }
        
        .stat-label {
            font-size: 14px;
            color: #7f8c8d;
            margin-top: 5px;
        }
        
        .contact-slide {
            text-align: center;
        }
        
        .contact-slide .slide-content {
            justify-content: center;
            align-items: center;
        }
        
        .contact-info {
            font-size: 18px;
            line-height: 2;
        }
        
        .contact-info strong {
            color: #2c3e50;
        }
        
        @media print {
            body {
                background: white;
            }
            .slide {
                margin: 0;
                box-shadow: none;
                width: 100%;
                height: 100vh;
            }
        }
    </style>
</head>
<body>
    <!-- Slide 1: Titre -->
    <div class="slide">
        <div class="slide-header">
            <h1>{{ $data['project_name'] }}</h1>
            <p style="font-size: 18px; margin-top: 20px; opacity: 0.9;">
                {{ $data['project_description'] }}
            </p>
        </div>
        <div class="slide-content">
            <div style="text-align: center;">
                <p style="font-size: 18px; color: #7f8c8d;">
                    Présenté par {{ $data['user_profile']->first_name ?? '' }} {{ $data['user_profile']->last_name ?? '' }}
                </p>
                <p style="font-size: 16px; color: #95a5a6;">
                    {{ \Carbon\Carbon::now()->locale('fr')->isoFormat('MMMM YYYY') }}
                </p>
            </div>
        </div>
    </div>
    
    <!-- Contenu généré par l'IA -->
    {!! $content !!}
    
    <!-- Slide finale: Contact -->
    <div class="slide contact-slide">
        <div class="slide-title">Contact</div>
        <div class="slide-content">
            <div class="contact-info">
                <p><strong>{{ $data['user_profile']->first_name ?? '' }} {{ $data['user_profile']->last_name ?? '' }}</strong></p>
                @if($data['user_profile']->email)
                    <p>📧 {{ $data['user_profile']->email }}</p>
                @endif
                @if($data['user_profile']->phone)
                    <p>📞 {{ $data['user_profile']->phone }}</p>
                @endif
                <br>
                <p style="font-size: 24px; color: #3498db; font-weight: bold;">
                    Merci pour votre attention !
                </p>
                <p style="font-size: 16px; color: #7f8c8d;">
                    Questions & Discussion
                </p>
            </div>
        </div>
    </div>
</body>
</html>

