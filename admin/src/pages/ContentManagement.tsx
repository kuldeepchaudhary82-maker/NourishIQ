import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2, Edit2, BookOpen, Lightbulb, Pizza } from 'lucide-react';
import axios from 'axios';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('TIPS');
  const [content, setContent] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContent = async () => {
    try {
      let url = '';
      if (activeTab === 'TIPS') url = 'https://nourishiq-production.up.railway.app/api/content/tips';
      if (activeTab === 'ARTICLES') url = 'https://nourishiq-production.up.railway.app/api/content/articles';
      if (activeTab === 'FOOD') url = 'https://nourishiq-production.up.railway.app/api/content/food-database/search';
      
      const res = await axios.get(url);
      setContent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      let url = `https://nourishiq-production.up.railway.app/api/admin/content/${id}`;
      if (activeTab === 'FOOD') url = `https://nourishiq-production.up.railway.app/api/admin/food-database/${id}`;
      
      await axios.delete(url);
      setContent(content.filter(item => item.id !== id));
      alert('Content deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete content');
    }
  };

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Content Management</h1>
          <p className="text-textSecondary">Curate and manage all user-facing content.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-opacity-90 transition-all">
          <Plus size={18} />
          Create {activeTab.toLowerCase()}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('TIPS')}
          className={`px-4 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'TIPS' ? 'text-primary border-primary' : 'text-textSecondary border-transparent'}`}
        >
          <div className="flex items-center gap-2">
            <Lightbulb size={16} /> Health Tips
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('ARTICLES')}
          className={`px-4 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'ARTICLES' ? 'text-primary border-primary' : 'text-textSecondary border-transparent'}`}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} /> Articles
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('FOOD')}
          className={`px-4 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'FOOD' ? 'text-primary border-primary' : 'text-textSecondary border-transparent'}`}
        >
          <div className="flex items-center gap-2">
            <Pizza size={16} /> Food Database
          </div>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 text-textSecondary bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Content Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.length > 0 ? (
          content.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.type === 'TIP' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {activeTab}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-textSecondary hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 text-danger hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2 line-clamp-2">{item.title || item.name}</h3>
                <p className="text-textSecondary text-sm line-clamp-3 mb-4">{item.body || item.category}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {item.tags?.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-50 text-textSecondary text-[10px] rounded-full border border-gray-100 font-medium lowercase">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Plus size={32} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-secondary">No {activeTab.toLowerCase()} found</h3>
            <p className="text-textSecondary text-sm mt-1 max-w-xs px-6">
              Start by creating your first piece of content for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
