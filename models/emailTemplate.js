const mongoose = require('mongoose');
const Handlebars = require('handlebars');

const EmailTemplate = mongoose.model('EmailTemplate', {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

async function insertTemplates() {
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to Boilerplate',
      message: `{{userName}},
        <p>
          Thank you for signing up for Boilerplate!
        </p>
        <p>
          
        </p>
        <p>
          
        </p>
      
        
      `,
    },
    {
      name: 'purchase',
      subject: 'You purchased "{{bookTitle}}" at builderbook.org',
      message: `{{userName}},
        <p>
          Thank you for purchasing our book!
        </p>
        <p>
          Start reading your book: <a href="{{bookUrl}}" target="_blank">{{bookTitle}}</a>
        </p>
        <p>
          If you have any questions while reading the book, 
          please fill out an issue on 
          <a href="https://github.com/builderbook/builderbook target="blank">Github</a>.
        </p>
      
        Kelly & Timur, Team Builder Book
      `,
    },
  ];

  for (let i = 0; i < templates.length; i += 1) {
    const t = templates[i];

    // eslint-disable-next-line no-await-in-loop
    const count = await EmailTemplate.find({ name: t.name }).countDocuments();

    if (count === 0) {
      EmailTemplate.create({
        ...t,
        message: t.message.replace(/\n/g, '').replace(/[ ]+/g, ' '),
      });
    }
  }
}

insertTemplates();

async function getEmailTemplate(name, params) {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error('not found');
  }

  return {
    message: Handlebars.compile(source.message)(params),
    subject: Handlebars.compile(source.subject)(params),
  };
}

exports.insertTemplates = insertTemplates;
exports.getEmailTemplate = getEmailTemplate;
