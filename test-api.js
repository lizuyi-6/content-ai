// 快速测试 API
const fetch = require('node-fetch');

async function test() {
  console.log('🧪 测试 ContentAI API...\n');

  const testData = {
    idea: '我刚学会用 AI 写代码，效率提升了 10 倍',
    platforms: ['twitter', 'weibo']
  };

  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const data = await res.json();
    
    if (data.success) {
      console.log('✅ API 调用成功！\n');
      
      Object.entries(data.data).forEach(([platform, content]) => {
        console.log(`\n📱 ${content.platform}:`);
        console.log('─'.repeat(50));
        console.log(content.content.substring(0, 200) + '...');
        console.log(`字数：${content.length}`);
      });
    } else {
      console.log('❌ API 返回错误:', data.error);
    }
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('\n请确保服务器已启动：npm start');
  }
}

test();
