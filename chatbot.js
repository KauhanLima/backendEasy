
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); 
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));



client.on('message', async msg => {
    const now = new Date();
    const hour = now.getHours();

    const startHour = 8;
    const endHour = 20;

    if (hour < startHour || hour >= endHour) {
        
        await client.sendMessage(msg.from, 'Olá! No momento nosso atendimento está offline. Nosso horário é das 08:00 às 20:00.');
        return;
    }

    
    if (msg.body.match(/(menu|Menu|oi|Olá|olá|ajuda)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname || 'amigo';
        await client.sendMessage(msg.from, 'Olá ' + name.split(" ")[0] + ', sou assistente virtual do Kauhãn, por favor escolha um número: \n\n1 - Consulta de Saldo\n2 - Status de pedido\n3 - Horário de funcionamento\n4 - Políticas da Empresa\n5 - Outras perguntas');
    }

    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|ajuda|gostaria|hello)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(msg.from, 'Olá! ' + name.split(" ")[0] + ', sou assistente virtual do kauhãn, por favor escolha um numero: \n\n1 - Consulta de Saldo\n2 - Status de pedido\n3 - Horario de funcionamento\n4 - Politicas da Empresa\n5 - Outras perguntas');
        await delay(3000);
        await chat.sendStateTyping();
        await delay(5000);


    }


    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'voce selecionou a consulta de saldo:');

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'seus dados são esses:');

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para os flamenguista chorarem: https://youtu.be/bVsRK1AbDaw?si=U3zpOuTsC1c2Oo5c');


    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'voce selecionou Status de pedido');

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'Status do seu pedido está:');
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'voce selecionou Horários de funcionamento');

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'nosso horario de funcionamento é das *08:00am* as *20:00*');

    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'voce selecionou Politicas da empresa');


        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'a politica da empresa easy.....');


    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp ou visite nosso site: ');


    }

});